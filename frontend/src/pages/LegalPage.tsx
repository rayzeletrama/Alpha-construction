import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "../lib/axios";
import { Loader2 } from "lucide-react";

export const LegalPage = () => {
  const { slug } = useParams();

  const { data: page, isLoading } = useQuery({
    queryKey: ["page", slug],
    queryFn: async () => (await api.get(`/v1/pages/${slug}`)).data,
  });

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  if (!page)
    return (
      <div className="pt-40 text-center uppercase font-black">
        Page introuvable
      </div>
    );

  return (
    <div className="pt-40 pb-24 px-6 max-w-4xl mx-auto">
      <h1 className="text-5xl font-black tracking-tighter uppercase mb-12 border-b-8 border-primary inline-block">
        {page.title}
      </h1>
      <div className="space-y-12">
        {page.content.sections?.map((section: any, i: number) => (
          <div key={i} className="space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-widest">
              {section.title}
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {section.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
