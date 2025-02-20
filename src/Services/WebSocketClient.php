<?php

namespace Services;

use WebSocket\Client;

class WebSocketClient
{
    private $client;
    private $apiKey;

    public function __construct($apiKey)
    {
        $this->apiKey = $apiKey;
        $this->client = new Client("wss://stream.aisstream.io/v0/stream");
    }

    public function sendMessage($message)
    {
        $this->client->send($message);
    }

    public function receiveMessage()
    {
        return $this->client->receive();
    }
}
