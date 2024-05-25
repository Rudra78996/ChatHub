class PeerProvider {
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            url: 'stun:global.stun.twilio.com:3478',
            urls: 'stun:global.stun.twilio.com:3478'
          },
          {
            url: 'turn:global.turn.twilio.com:3478?transport=udp',
            username: '53bcad5d5915da28c9d60b923bbae352ed4be76754c1075b29847389138b3ee9',
            urls: 'turn:global.turn.twilio.com:3478?transport=udp',
            credential: 'NCCb9R6NUi0/ms0HwiQ3OpKscc3Pbe1YSEXVCe8JQLM='
          },
          {
            url: 'turn:global.turn.twilio.com:3478?transport=tcp',
            username: '53bcad5d5915da28c9d60b923bbae352ed4be76754c1075b29847389138b3ee9',
            urls: 'turn:global.turn.twilio.com:3478?transport=tcp',
            credential: 'NCCb9R6NUi0/ms0HwiQ3OpKscc3Pbe1YSEXVCe8JQLM='
          },
          {
            url: 'turn:global.turn.twilio.com:443?transport=tcp',
            username: '53bcad5d5915da28c9d60b923bbae352ed4be76754c1075b29847389138b3ee9',
            urls: 'turn:global.turn.twilio.com:443?transport=tcp',
            credential: 'NCCb9R6NUi0/ms0HwiQ3OpKscc3Pbe1YSEXVCe8JQLM='
          }
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
