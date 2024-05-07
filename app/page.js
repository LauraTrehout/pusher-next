"use client";

import Pusher from "pusher-js";
import styles from "./page.module.css";
import { useEffect } from "react";
import axios from "axios";

export const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
  userAuthentication: {
    // endpoint: `${process.env.NEXT_PUBLIC_SERVER}/pusher/authentication`,
    endpoint: `/api/pusher/authentication`,
    params: {
      userId: "1",
    },
  },
  channelAuthorization: {
    endpoint: `api/pusher/authorization`,
    params: {
      userId: +(Math.random() * 10).toFixed(0),
    },
  },
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
});

const handlePublicEventTrigger = async () => {
  const socketId = pusher.connection.socket_id;
  return await axios.post(
    `${process.env.NEXT_PUBLIC_SERVER}/pusher/picking-trigger?socket_id=${socketId}`
  );
};

const handlePrivateEventTrigger = async () => {
  const socketId = pusher.connection.socket_id;
  return await axios.post(
    `${process.env.NEXT_PUBLIC_SERVER}/pusher/refunds-trigger?socket_id=${socketId}`
  );
};

export default function Home() {
  useEffect(() => {
    pusher.signin();
    const pickingChannel = pusher.subscribe("picking-channel");
    pickingChannel.bind("updated-picking-list", (data) => {
      alert(data.message);
    });
    const refundsChannel = pusher.subscribe("private-refunds-channel");
    refundsChannel.bind("added-refund", (data) => {
      alert(data.message);
    });
    return () => {
      pusher.unsubscribe("picking-channel");
      pusher.unsubscribe("private-refunds-channel");
    };
  }, []);

  return (
    <main className={styles.main}>
      TEST PUSHER
      <button className={styles.card} onClick={handlePublicEventTrigger}>
        Trigger public event
      </button>
      <button className={styles.card} onClick={handlePrivateEventTrigger}>
        Trigger private event
      </button>
    </main>
  );
}
