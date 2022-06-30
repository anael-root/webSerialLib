/*
Copyright (c) 2022-present Anael Racine

 * License MIT

*/

class LineBreakTransformer {
    constructor() {
      this.container = '';
    }
  
    transform(chunk, controller) {
      this.container += chunk;
      const lines = this.container.split('\r\n');
      this.container = lines.pop();
      lines.forEach(line => controller.enqueue(line));
    }
  
    flush(controller) {
      controller.enqueue(this.container);
    }
  }

class webseriallib {

    constructor(speed) {
        this.connected = false
        this.speedSelected = speed
        this.history =  [{ time: Date.now(), text: "Init" }]
      }
      static isBrowserCompatible(){
        return "serial" in navigator
      }
    async connect() {
        try {
            this.port = await navigator.serial.requestPort();
            await this.port.open({ baudRate: this.speedSelected ,dataBits: 8,
                            stopBits: 1,
                            parity: "none",
                            flowControl: "none",});
    
            
            this.connected = true;
            this.history.push({ time: Date.now(), text: this.port.getInfo() })
    
            this.closedPromise = this.read();
          } catch (e) {
            console.log(e)
            this.history.push({ time: Date.now(), text: e })
          }
    }

    async disconnect() {
        this.connected = false;
        await this.reader.cancel();
        await this.reader.releaseLock();
        await this.readableStreamDecodeClosed.catch(() => { /* Ignore the error */ });
        await this.readableStreamClosed.catch(() => { /* Ignore the error */ });
        await this.port.close();
    }

    async send(message) {
        try {
            const encoder = new TextEncoder();
            const writer = this.port.writable.getWriter();
            await writer.write(encoder.encode(message + "\r\n",{ stream: true }));
            this.history.push({ time: Date.now(), text: message + "\r\n" })
            writer.releaseLock();
    
           
          } catch (error) {
            console.log(error)
            this.history.push({ time: Date.now(), text: error })
          }
    }

    async read() {
        while (this.port.readable && this.connected) {
            const textDecoder = new window.TextDecoderStream();
            const transformStream = new window.TransformStream(new LineBreakTransformer())
            this.readableStreamDecodeClosed = textDecoder.readable.pipeTo(transformStream.writable)
            this.readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
            this.reader = transformStream.readable.getReader();
         
          try {
            var loop = true;
            while (loop) {
              const { value, done } = await this.reader.read();
              if (done) {
                await this.reader.releaseLock();
                break;
              }
              this.history.push({ time: Date.now(), text: value })
            }
          } catch (error) {
            console.log(error)
            this.history.push({ time: Date.now(), text: error })
          } finally {
            this.history.push({ time: Date.now(), text: "Disconnected" })
          }
      }
    }

}

export  {

    webseriallib,
    LineBreakTransformer


}