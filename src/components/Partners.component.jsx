import React from "react";
import Link from "next/link";
import partnersStyles from "../styles/Partners.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import alttrading from "src/public/assets/partners/alttrading.png";
import polygon from "src/public/assets/partners/polygon.svg";
import vantage from "src/public/assets/partners/vantage.png";

export default function Partners() {
  const router = useRouter();
  return (
    <div className={partnersStyles.container}>
      <Link href="https://polygon.io/">
        <Image src={polygon} alt="Polygon" className={partnersStyles.image} />
      </Link>
      <Link href="https://www.alti-trading.fr/">
        <Image
          src={alttrading}
          alt="AltiTrading"
          className={partnersStyles.image}
        />
      </Link>
      <Link href="https://www.alphavantage.co/">
        <Image
          src={vantage}
          alt="Alpha Vantage"
          className={partnersStyles.image}
        />
      </Link>
    </div>
  );
}
