import { ForbiddenException, Injectable, OnModuleInit } from '@nestjs/common';
import * as mqtt from 'mqtt';
import * as dotenv from 'dotenv';
import { NewFeedDto, PublicDto } from './dto';
import { ERRORS } from 'src/common/errors';
import axios from 'axios';
import * as qs from 'qs';
import { group } from 'console';

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
    if (!data.state_feed || !data.time_feed) {
      throw new ForbiddenException(ERRORS.FEED_KEY_NOT_FOUND)
    }

    const group = data.group ? `${data.group}.` : ""

    const state_feed = `${this.ADAFRUIT_USERNAME}/feeds/${group}${data.state_feed}`
    const time_feed = `${this.ADAFRUIT_USERNAME}/feeds/${group}${data.time_feed}`

    this.client.publish(time_feed, data.time, { qos: 1 }, (err) => {
      if (!err) {
        console.log(`Published: ${data.time} to ${data.time_feed}`);
      } else {
        throw new ForbiddenException(ERRORS.PUBLIC_ERROR + ":", err)
      }
    })

    this.client.publish(state_feed, data.state, { qos: 1 }, (err) => {
      if (!err) {
        console.log(`Published: ${data.state} to ${data.state_feed}`);
      } else {
        throw new ForbiddenException(ERRORS.PUBLIC_ERROR + ":", err)
      }
    })

    return;
  }

  async createNewFeed(dto: NewFeedDto) {
    const group = dto.group
    const id = dto.id

    console.log("Data: ", dto)

    const url = group ? `https://io.adafruit.com/api/v2/${this.ADAFRUIT_USERNAME}/groups/${group}/feeds` : `https://io.adafruit.com/api/v2/${this.ADAFRUIT_USERNAME}/feeds`

    console.log(`URL: ${url}`);

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

  async deleteFeed(dto: NewFeedDto) {
    const group = dto.group
    const id = dto.id

    const feed_key = group ? `${group}.${id}` : id

    console.log("Data: ", dto);

    const url = `https://io.adafruit.com/api/v2/${this.ADAFRUIT_USERNAME}/feeds/${feed_key}`

    console.log(`URL: ${url}`);

    // const form = qs.stringify({ feed_key: `${group}.${id}` })

    const headers = group ?
      {
        // 'Content-Type': 'application/x-www-form-urlencoded',
        'X-AIO-Key': this.ADAFRUIT_KEY
      } :
      {
        'X-AIO-Key': this.ADAFRUIT_KEY
      }
    // console.log("Form: ", form)
    try {
      let response = await axios.delete(url, { headers })
      // if (group) { response = await axios.post(url, null, { headers, params }); }
      // else { response = await axios.delete(url, { headers }) }
      return response;
    } catch (err) {
      throw new ForbiddenException(ERRORS.DELETE_FEED_ERROR + `: ${err}`)
    }
  }

  async createGroup(id: string) {
    const url = `https://io.adafruit.com/api/v2/${this.ADAFRUIT_USERNAME}/groups`
    const params = { name: id }
    const headers = {
      'X-AIO-Key': this.ADAFRUIT_KEY
    }

    try {
      const response = await axios.post(url, null, { headers, params })

      return response
    } catch (err) {
      throw new ForbiddenException(ERRORS.CREATE_NEW_GROUP_ERROR + `: ${err}`)
    }
  }

  async deleteGroup(id: string) {
    const url = `https://io.adafruit.com/api/v2/${this.ADAFRUIT_USERNAME}/groups/${id}`
    const headers = {
      'X-AIO-Key': this.ADAFRUIT_KEY
    }

    try {
      const response = await axios.delete(url, { headers })

      return response
    } catch (err) {
      throw new ForbiddenException(ERRORS.DELETE_GROUP_ERROR + `: ${err}`)
    }
  }
}