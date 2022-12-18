import Navbar from "../../public/NavBar.component";

export default function DashBoardLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      {/* <Footer /> */}
    </>
  );
}
