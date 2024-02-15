import xLogo from "../assets/images/x.svg";
import shibaLogo from "../assets/images/shiba.svg";

export default function Footer() {
  return (
    <div className="px-10 py-10 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <span>Copyright © 2023 Zombium - All Rights Reserved.</span>
        <div className="flex gap-5">
          <a href="https://x.com/Zombium" target="_blank">
            <img src={xLogo} className="w-8 h-8" alt="x" />
          </a>
          <a
            href="https://www.shibariumscan.io/token/0xb1635A8a344aFC0bDc0e8cF26954815644Be7370"
            target="_blank"
          >
            <img src={shibaLogo} className="w-8 h-8" alt="shiba" />
          </a>
        </div>
      </div>
    </div>
  );
}
