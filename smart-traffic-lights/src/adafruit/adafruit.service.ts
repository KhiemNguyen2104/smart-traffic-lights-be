import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mqtt from 'mqtt';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AdafruitService implements OnModuleInit {
  private client: mqtt.MqttClient;
  private ADAFRUIT_USERNAME = process.env.ADAFRUIT_USERNAME;
  private ADAFRUIT_KEY = process.env.ADAFRUIT_KEY;
  private ADAFRUIT_FEED = `${this.ADAFRUIT_USERNAME}/feeds/test0`;

  onModuleInit() {
    console.log(`ADAFRUIT connections:\n    User name: ${this.ADAFRUIT_USERNAME}\n    Key: ${this.ADAFRUIT_KEY}\n    Feed: ${this.ADAFRUIT_FEED}`)
    this.connect();
  }

  private connect() {
    const MQTT_URL = `mqtts://${this.ADAFRUIT_USERNAME}:${this.ADAFRUIT_KEY}@io.adafruit.com`;

    this.client = mqtt.connect(MQTT_URL);

    this.client.on('connect', () => {
      console.log('Connected to Adafruit MQTT server');
      this.subscribe();
    });

    this.client.on('error', (err) => {
      console.error('MQTT Error:', err);
    });

    this.client.on('message', (topic, message) => {
      console.log(`Received message on ${topic}: ${message.toString()}`);
    });
  }

  private subscribe() {
    this.client.subscribe(this.ADAFRUIT_FEED, (err) => {
      if (!err) {
        console.log(`Subscribed to ${this.ADAFRUIT_FEED}`);
      } else {
        console.error('Subscribe error:', err);
      }
    });
  }

  public publishData(data: string) {
    this.client.publish(this.ADAFRUIT_FEED, data, { qos: 1 }, (err) => {
      if (!err) {
        console.log(`Published: ${data} to ${this.ADAFRUIT_FEED}`);
      } else {
        console.error('Publish error:', err);
      }
    });
  }
}