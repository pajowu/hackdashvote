from autobahn.asyncio.websocket import WebSocketClientProtocol, \
    WebSocketClientFactory

import json
import random


class TestClientProtocol(WebSocketClientProtocol):
    def onOpen(self):
        self.sendMessage(json.dumps({"action":"get_votes", "event_name":"jhsued2016"}).encode())
        #self.sendClose()

    def onMessage(self, payload, inBinary):
        print(payload)

    def onClose(self, wasClean, code, reason):
        loop.stop()


if __name__ == '__main__':

    import asyncio

    factory = WebSocketClientFactory(u"ws://localhost:9000")
    factory.protocol = TestClientProtocol

    loop = asyncio.get_event_loop()
    connection = loop.create_connection(factory, 'localhost', 9000)
    loop.run_until_complete(connection)
    loop.run_forever()
    loop.close()
