"use client";
import { useVoice } from "@humeai/voice-react";
import { Button } from "./ui/Button/Button";
import { Mic, MicOff, Phone, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Toggle } from "./ui/toggle";
import MicFFT from "./MicFFT";
import { cn } from "@/utils";
import { useState } from "react";

export default function Controls({ setUserName }: { setUserName: (name: string) => void }) {
  const { disconnect, status, isMuted, unmute, mute, micFft, sendSessionSettings } = useVoice();
  const [nameInput, setNameInput] = useState("");

  const updateUserName = () => {
    if (nameInput) {
      setUserName(nameInput);
      sendSessionSettings({
        variables: {
          name: nameInput,
        },
      });
      setNameInput("");
    }
  };

  return (
    <div
      className={
        cn(
          "fixed bottom-0 left-0 w-full p-4 flex items-center justify-center",
          "bg-gradient-to-t from-card via-card/90 to-card/0",
        )
      }
    >
      <AnimatePresence>
        {status.value === "connected" ? (
          <motion.div
            initial={{
              y: "100%",
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: "100%",
              opacity: 0,
            }}
            className={
              "p-4 bg-card border border-border rounded-lg shadow-sm flex items-center gap-4"
            }
          >
            <Toggle
              pressed={!isMuted}
              onPressedChange={() => {
                if (isMuted) {
                  unmute();
                } else {
                  mute();
                }
              }}
            >
              {isMuted ? (
                <MicOff className={"size-4"} />
              ) : (
                <Mic className={"size-4"} />
              )}
            </Toggle>

            <div className={"relative grid h-8 w-48 shrink grow-0"}>
              <MicFFT fft={micFft} className={"fill-current"} />
            </div>

            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your name"
              className="p-2 border rounded"
            />

            <Button
              className={"flex items-center gap-1"}
              onClick={updateUserName}
            >
              <User className={"size-4 opacity-50"} />
              <span>Update Name</span>
            </Button>

            <Button
              className={"flex items-center gap-1"}
              onClick={() => {
                disconnect();
              }}
            >
              <span>
                <Phone
                  className={"size-4 opacity-50"}
                  strokeWidth={2}
                  stroke={"currentColor"}
                />
              </span>
              <span>End Call</span>
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}