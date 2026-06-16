import ProgressBar from "../../../shared/components/ui/ProgressBar";

export default function StudioReadiness({ studio }) {
  const documents = studio?.documents || [];
  const checks = [
    Boolean(studio?.brief?.logline),
    Boolean(studio?.brief?.audience),
    Boolean(studio?.synopsisDraft),
    Boolean(studio?.projectDescription),
    Boolean(studio?.pitchSummary),
    documents.some((doc) => doc.documentType === "pitch_deck"),
    documents.some((doc) => doc.documentType === "script"),
    documents.some((doc) => doc.documentType === "budget"),
    documents.some((doc) => doc.documentType === "investor_documents"),
  ];

  const completed = checks.filter(Boolean).length;
  const score = Math.round((completed / checks.length) * 100);

  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-white/55">Package readiness</span>
        <span>{score}%</span>
      </div>
      <ProgressBar value={score} />
      <p className="mt-3 text-xs leading-6 text-white/42">
        Complete brief, synopsis, pitch summary, and investor documents to make
        this project package ready for marketplace review.
      </p>
    </div>
  );
}
