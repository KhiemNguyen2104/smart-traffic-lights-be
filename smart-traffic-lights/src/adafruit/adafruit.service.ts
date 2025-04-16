import { ForbiddenException, Injectable, OnModuleInit } from '@nestjs/common';
import * as mqtt from 'mqtt';
import * as dotenv from 'dotenv';
import { PublicDto } from './dto';
import { ERRORS } from 'src/common/errors';
import axios from 'axios';

dotenv.config();

@Injectable()
export class AdafruitService implements OnModuleInit {
  private client: mqtt.MqttClient;
  private ADAFRUIT_USERNAME = process.env.ADAFRUIT_USERNAME;
  private ADAFRUIT_KEY = process.env.ADAFRUIT_KEY;
  // private ADAFRUIT_FEED = `${this.ADAFRUIT_USERNAME}/feeds/test0`;

  onModuleInit() {
    console.log(`ADAFRUIT connections:\n    User name: ${this.ADAFRUIT_USERNAME}\n    Key: ${this.ADAFRUIT_KEY}`)
    this.connect();
  }

  private connect() {
    const MQTT_URL = `mqtts://${this.ADAFRUIT_USERNAME}:${this.ADAFRUIT_KEY}@io.adafruit.com`;

    this.client = mqtt.connect(MQTT_URL);

    this.client.on('connect', () => {
      console.log('Connected to Adafruit MQTT server');
    });

    this.client.on('error', (err) => {
      console.error('MQTT Error:', err);
    });

    this.client.on('message', (topic, message) => {
      console.log(`Received message on ${topic}: ${message.toString()}`);
    });
  }

  // private subscribe() {
  // this.client.subscribe(this.ADAFRUIT_FEED, (err) => {
  //   if (!err) {
  //     console.log(`Subscribed to ${this.ADAFRUIT_FEED}`);
  //   } else {
  //     console.error('Subscribe error:', err);
  //   }
  // });
  // }

  public publishData(data: PublicDto) {
    if (!data.green_feed || !data.red_feed) {
      throw new ForbiddenException(ERRORS.FEED_KEY_NOT_FOUND)
    }

    data.green_feed = `${this.ADAFRUIT_USERNAME}/feeds/${data.green_feed}`.replaceAll('_', '-')
    data.red_feed = `${this.ADAFRUIT_USERNAME}/feeds/${data.red_feed}`.replaceAll('_', '-')
    data.yellow_feed = `${this.ADAFRUIT_USERNAME}/feeds/${data.yellow_feed}`.replaceAll('_', '-')

    this.client.publish(data.green_feed, data.g_time, { qos: 1 }, (err) => {
      if (!err) {
        console.log(`Published: ${data.g_time} to ${data.green_feed}`);
      } else {
        throw new ForbiddenException(ERRORS.PUBLIC_ERROR + ":", err)
      }
    })

    this.client.publish(data.red_feed, data.r_time, { qos: 1 }, (err) => {
      if (!err) {
        console.log(`Published: ${data.r_time} to ${data.red_feed}`);
      } else {
        throw new ForbiddenException(ERRORS.PUBLIC_ERROR + ":", err)
      }
    })

    if (data.yellow_feed) {
      this.client.publish(data.yellow_feed, data.y_time, { qos: 1 }, (err) => {
        if (!err) {
          console.log(`Published: ${data.y_time} to ${data.yellow_feed}`);
        } else {
          throw new ForbiddenException(ERRORS.PUBLIC_ERROR + ":", err)
        }
      })
    }

    return;
  }

  async createNewFeed(id: string) {
    const url = `https://io.adafruit.com/api/v2/${this.ADAFRUIT_USERNAME}/feeds`

    const body = {
      feed: {
        name: id
      }
    };

    const headers = {
      'Content-Type': 'application/json',
      'X-AIO-Key': this.ADAFRUIT_KEY,
    };

    try {
      const response = await axios.post(url, body, { headers });

      // console.log(`Created new Feed at ${url}`);
      // console.log(`Feed name: ${id}`);
      // console.log(`Response:`, response.data);

      return response.data;

    } catch (err) {
      console.error(`Failed to create new feed: ${err?.response?.data?.error || err.message}`);
      throw new ForbiddenException(`${ERRORS.CREATE_NEW_FEED_ERROR}: ${err?.response?.data?.error || err.message}`);
    }
  }
}