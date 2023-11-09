import React from "react";
import ConnectWallet from "../ConnectWalletButton";

export default function Header() {
  return (
    <div className="container mx-auto ">
      <header className="p-5">
        <div className="flex justify-end items-center">
          <ConnectWallet />
        </div>
      </header>
    </div>
  );
}
