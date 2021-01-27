# @iainfarq/homebridge-mcp9808

Homebridge plugin for the Microchip MCP9808 sensor on RasPi, based on
[mcp9808-temperature-sensor](https://www.npmjs.com/package/mcp9808-temperature-sensor)

[![NPM Downloads](https://img.shields.io/npm/dm/@iainfarq/homebridge-mcp9808.svg?style=flat)](https://npmjs.org/package/@iainfarq/homebridge-mcp9808)



Note that this plugin only provides the temperature reading facility of the MCP9808.  Alarms based on temperature
are not currently possible in HomeKit, so are not provided.

## Installation

`npm install homebridge-mcp9808`

## Connecting the sensor

This is better covered by [mcp9808-temperature-sensor](https://www.npmjs.com/package/mcp9808-temperature-sensor) and the [i2c-bus](https://www.npmjs.com/package/i2c-bus) package, but ultimately involves adding the sensor to the i2c bus on the board that you are using.  The
standard i2C address for the MCP9808 is 0x18, and this can be checked on the Raspberry Pi by running the command

    > i2cdetect -y 1
which will display something similar to

         0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
    00: -- -- -- -- -- -- -- -- -- -- -- -- -- 
    10: -- -- -- -- -- -- -- -- 18 -- -- -- -- -- -- -- 
    20: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
    30: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
    40: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
    50: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
    60: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
    70: -- -- -- -- -- -- 76 --                         
This indicates that there is a device present at 0x18 - our MCP9808 - and another device at 0x76, which we are not interested in.
 
## Configuration

Enabled by adding an entry ino the 'accessories' section of the `config.json` file.  The named sections have the following behaviors:

* `accessory` - must be "MCP9808" to identify the plugin
* `name` - initial name in Homekit of the sensor.  May be changed here, or in the Home app.
* `refresh` - specifies the refresh time in seconds.  The sensor is polled using this interval, and Homekit is provided with the last 
value read. If omitted, the default value of 60 seconds is used.
* `options` - supplied directly to [mcp9808-temperature-sensor](https://www.npmjs.com/package/mcp9808-temperature-sensor), and is specified in that package.  Common values are:
`i2cBusNumber`, which is '1' for Raspberry Pi, and `i2cAddress`, which is '0x18' for the base address of the MCP9808.

## Example Configuration

config.json
```json
    {
         "bridge": {
         "name": "Homebridge",
         "username": "CC:46:3D:E3:CE:30",
         "port": 51826,
         "pin": "031-45-154"
     },
     "description": "Config file for raspberry pi running MCP9808 temperature sensor",
 
     "accessories": [
         {
             "accessory": "MCP9808",
             "name": "Temperature",
             "refresh": 60,
             "options": {
               "i2cBusNumber": 1,
               "i2cAddress": "0x18"
             }
         }
     ],
 
     "platforms": [
     ]
    }
```

[MCP9808 datasheet](https://ww1.microchip.com/downloads/en/DeviceDoc/MCP9808-0.5C-Maximum-Accuracy-Digital-Temperature-Sensor-Data-Sheet-DS20005095B.pdf)
