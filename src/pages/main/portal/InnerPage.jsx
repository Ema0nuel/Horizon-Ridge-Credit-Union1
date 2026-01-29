import { useParams } from "react-router-dom";
import { pagesData } from "../../../data/pagesData";
import { SectionRenderer } from "../../../components/sections/SectionRenderer";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import NotFoundPage from "../../admin/main/NotFound";

export function InnerPage() {
  const { slug } = useParams();
  const page = pagesData.find((p) => p.slug === slug);

  if (!page) {
    return <NotFoundPage />;
  }

  return (
    <>
      <div className="min-h-screen bg-primary flex flex-col">
        <Navbar />

        <main className="flex-1">
          {page.sections.map((section, idx) => (
            <SectionRenderer key={idx} section={section} />
          ))}
        </main>

        <Footer />
      </div>
    </>
  );
}
