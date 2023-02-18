import Navbar from "../NavBar.component";
import Footer from "../Footer.component";
import layoutStyle from "../../styles/Layout.module.css";

export default function DashBoardLayout({ children }) {
  return (
    <>
      <div className={layoutStyle.globalContainer}>
        <div className={layoutStyle.content}>
          <Navbar />
          <main>{children}</main>
        </div>
        <div className={layoutStyle.footerSection}>
          <Footer />
        </div>
      </div>
    </>
  );
}
