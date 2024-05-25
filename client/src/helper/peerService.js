class PeerProvider {
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
          {
            urls: "turn:global.relay.metered.ca:80",
            username: "29123a95a7760d9589bd2fe9",
            credential: "+s3gnlXw0IitKA5n",
          },
          {
            urls: "turn:global.relay.metered.ca:80?transport=tcp",
            username: "29123a95a7760d9589bd2fe9",
            credential: "+s3gnlXw0IitKA5n",
          },
          {
            urls: "turn:global.relay.metered.ca:443",
            username: "29123a95a7760d9589bd2fe9",
            credential: "+s3gnlXw0IitKA5n",
          },
          {
            urls: "turns:global.relay.metered.ca:443?transport=tcp",
            username: "29123a95a7760d9589bd2fe9",
            credential: "+s3gnlXw0IitKA5n",
          },
      ],
      });
    }
  }

  async getAnswer(offer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(offer);
      const ans = await this.peer.createAnswer();
      await this.peer.setLocalDescription(new RTCSessionDescription(ans));
      return ans;
    }
  }

  async setRemoteDescription(ans) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    }
  }

  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  }
}

export default new PeerProvider();
