import asyncio
import json
import importlib
import copy
from autobahn.asyncio.websocket import WebSocketServerProtocol, \
    WebSocketServerFactory


from handlers import MongoDBVoteHandler




class BroadcastServerFactory(WebSocketServerFactory):
    clients = []
    def register(self, client):
        if client not in self.clients:
            self.clients.append(client)

    def unregister(self, client):
        if client in self.clients:
            self.clients.remove(client)

    def broadcast(self, msg):
        print(msg)
        if not isinstance(msg, bytes):
            msg = msg.encode("utf8")
        for c in self.clients:
            c.sendMessage(msg)


class ExternalHandlerServerProtocol(WebSocketServerProtocol):
    handler = None

    def onOpen(self):
        self.factory.register(self)

    def onClose(self, *args, **kwargs):
        WebSocketServerProtocol.onClose(self, *args, **kwargs)
        self.factory.unregister(self)

    @asyncio.coroutine
    def onMessage(self, payload, isBinary):
        """ Handle messages """
        if not isBinary:
            if isinstance(payload, bytes):
                payload = payload.decode("utf8")
            data = json.loads(payload)
            handling_function = getattr(self.handler, data["action"])
            result = handling_function(self, payload)
            if result:
                if isinstance(result, str):
                    result = result.encode("utf-8")
                elif not isinstance(result, bytes):
                    result = json.dumps(result).encode("utf-8") 
                self.sendMessage(result)

#https://hackdash.org/api/v2/jhsued2016/projects'

if __name__ == '__main__':

    factory = BroadcastServerFactory(u"ws://localhost:9000")
    factory.protocol = ExternalHandlerServerProtocol
    factory.protocol.handler = MongoDBVoteHandler()

    loop = asyncio.get_event_loop()
    server = loop.create_server(factory, 'localhost', 9000)
    ruc = loop.run_until_complete(server)
    print("Started, listening on port 9000")
    try:
        loop.run_forever()
    except KeyboardInterrupt:
        pass
    finally:
        ruc.close()
        loop.close()
