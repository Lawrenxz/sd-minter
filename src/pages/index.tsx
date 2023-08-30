import Layout from "components/layout/Layout";
import FirstSection from "components/firstSection/FirstSection";

export default function Home() {
  return (
    <Layout title="Home">
      <main className="relative bg-gradient-to-b from-gray-900/10 to-[#010511]">
        <FirstSection />
      </main>
    </Layout>
  );
}
