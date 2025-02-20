<?php

namespace Services;

class AISDataService
{
    public function processIncomingData($data)
    {
        $unescapedMessage = stripslashes($data);
        $decodedData = json_decode($unescapedMessage, true);

        if (isset($decodedData['MetaData']['MMSI'])) {
            $mmsi = $decodedData['MetaData']['MMSI'];
            return [
                'mmsi' => $mmsi,
                'rawData' => $decodedData
            ];
        }

        return null; // Invalid or empty message
    }
}
