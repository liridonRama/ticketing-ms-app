import nats, { Stan } from 'node-nats-streaming';


class NatsWrapper {
  private _client?: Stan;

  get client(): Stan {
    if (!this._client) {
      throw new Error("Can't access nats client before connecting");
    }

    return this._client;
  }

  public async connect(clusterId: string, clientId: string, url: string): Promise<void> {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {

      this.client.on("connect", () => {
        console.log("Connected to NATS");

        resolve();
      })

      this.client.on("error", (err) => reject(err))
    });
  }
}

export const natsWrapper = new NatsWrapper();