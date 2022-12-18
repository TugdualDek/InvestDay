import Navbar from "../NavBar.component";

export default function DashBoardLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      {/* <Footer /> */}
    </>
  );
}

export async function getServerSideProps(context) {
  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {}, // Will be passed to the page component as props
  };
}
