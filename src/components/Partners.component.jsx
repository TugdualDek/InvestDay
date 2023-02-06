import React from "react";
import Link from "next/link";
import partnersStyles from "../styles/Partners.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import alttrading from "src/public/assets/partners/alttrading.png";
import polygon from "src/public/assets/partners/polygon.png";
import vantage from "src/public/assets/partners/vantage.png";

export default function Partners() {
  const router = useRouter();
  return (
    <div className={partnersStyles.container}>
      <Link href="/partners">
        <Image
          src={polygon}
          alt="Alpha Vantage"
          className={partnersStyles.image}
        />
      </Link>
      <Link href="/partners">
        <Image
          src={alttrading}
          alt="Alpha Vantage"
          className={partnersStyles.image}
        />
      </Link>
      <Link href="/partners">
        <Image
          src={vantage}
          alt="Alpha Vantage"
          className={partnersStyles.image}
        />
      </Link>
    </div>
  );
}
