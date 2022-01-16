import { AsyncQueue } from '@sapphire/async-queue';
import EventEmitter from 'node:events';
import { WebSocket } from 'ws';

export interface Gateway {
    on(event: "message", listener: (gateway: Gateway, raw: string) => void): this;
    once(event: "message", listener: (gateway: Gateway, raw: string) => void): this;
    on(event: "open", listener: (gateway: Gateway) => void): this;
    once(event: "open", listener: (gateway: Gateway) => void): this;
    on(event: "close", listener: (gateway: Gateway, code: number) => void): this;
    once(event: "close", listener: (gateway: Gateway, code: number) => void): this;
    on(event: "error", listener: (gateway: Gateway, error: Error) => void): this;
    once(event: "error", listener: (gateway: Gateway, error: Error) => void): this;
}


export class Gateway extends EventEmitter {
	public connection: WebSocket | undefined;
	public queue = new AsyncQueue();
	public headers: { [key: string]: string } = {};

	public get connnected() {
		return this.connection?.readyState === WebSocket.OPEN;
	}

	public constructor(private url: string, headers?: { [key: string]: string }) {
		super();
		if (headers) this.headers = headers;
	}

	public setClientId(userId: string) {
		this.headers['User-Id'] ??= userId;
		return this;
	}

	public setAuthorization(authorization: string) {
		this.headers['Authorization'] ??= authorization;
		return this;
	}

	public setClientName(clientName: string) {
		this.headers['Client-name'] ??= clientName;
		return this;
	}

	public async connect(): Promise<this> {
		return new Promise((resolve) => {
			this.connection = new WebSocket(this.url, { headers: this.headers });
			this.connection.on('message', (raw) => this.emit('message', this, raw));
			this.connection.on('open', () => this.emit('open', this));
			this.connection.on('close', (code) => this.emit('close', this, code));
			this.connection.on('error', (error) => this.emit('error', this, error));
			return resolve(this);
		});
	}

	public async send<T>(message: T) {
		if (!this.connnected || !this.connection) new Error('Websocket connection are not estabilished yet.');
		await this.queue.wait();
		try {
			this.connection?.send(JSON.stringify(message));
			return this;
		} finally {
			this.queue.shift();
		}
	}
}
