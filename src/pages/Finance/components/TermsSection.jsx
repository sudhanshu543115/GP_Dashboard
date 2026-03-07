export default function TermsSection({ terms, setTerms, readOnly }) {

  return (
    <div className="mt-8">
      <h2 className="font-semibold text-indigo-900 mb-2">
        Terms & Conditions
      </h2>

      <textarea
        rows={5}
        value={terms}
        disabled={readOnly}
        onChange={(e) => setTerms(e.target.value)}
        className="w-full border rounded p-3"
      />
    </div>
  );
}