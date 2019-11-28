'use strict';

const Mcp9808 = require('mcp9808-temperature-sensor');
var os = require("os");
var hostname = os.hostname();

let Service, Characteristic;

module.exports = (homebridge) => {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory('homebridge-mcp9808', 'MCP9808', MCP9808Plugin);
};

class MCP9808Plugin {
    constructor(log, config) {
        this.log = log;
        this.name = config.name;
        this.name_temperature = config.name_temperature || this.name;
        this.refresh = config['refresh'] || 60; // Update every minute
        this.options = config.options || {};
        
        this.init = false;
        this.data = {};
        if ('i2cBusNumber' in this.options) this.options.i2cBusNumber = parseInt(this.options.i2cBusNumber);
        if ('i2cAddress' in this.options) this.options.i2cAddress = parseInt(this.options.i2cAddress);
        this.log(`MCP9808 sensor options: ${JSON.stringify(this.options)}`);

        this.informationService = new Service.AccessoryInformation();

        this.informationService
            .setCharacteristic(Characteristic.Manufacturer, "Microchip Technology Inc.")
            .setCharacteristic(Characteristic.Model, "MCP9808")
            .setCharacteristic(Characteristic.FirmwareRevision, require('./package.json').version);

        Mcp9808.open(this.options)
            .then((sensor) => {
                this.log(`MCP9808 initialization succeeded`);
                this.sensor = sensor;
                this.init = true;

        this.informationService
            .setCharacteristic(Characteristic.SerialNumber, sensor.manufacturerId() + "-" + sensor.deviceId());
                this.devicePolling.bind(this);
            })
            .catch(err => this.log(`MCP9808 initialization failed: ${err} `));


        this.temperatureService = new Service.TemperatureSensor(this.name_temperature);

        this.temperatureService
            .getCharacteristic(Characteristic.CurrentTemperature)
            .setProps({
                minValue: -100,
                maxValue: 100
            });
        //        .on('get', this.getCurrentTemperature.bind(this));

        setInterval(this.devicePolling.bind(this), this.refresh * 1000);

        this.temperatureService.log = this.log;

    }

    devicePolling() {
        //console.log("Polling MCP9808");
        if (this.sensor) {
            this.sensor.temperature()
                .then((temp) => {
                    this.log(`MCP9808 temp = ${temp.celsius} °C`);
                    this.temperatureService
                        .setCharacteristic(Characteristic.CurrentTemperature, temp.celsius);
                })
                .catch(err => {
                    this.log(`MCP9808 read error: ${err}`);
                    console.log(err.stack);
                });
        } else {
            this.log("Error: MCP9808 not initalized");
        }
    }

    getServices() {
        return [this.informationService, this.temperatureService]
    }
}
