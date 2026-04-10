export default function ComingSoon({ nome }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
      <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mb-4">
        <span className="text-3xl">🚧</span>
      </div>
      <h2 className="text-xl font-bold text-gray-700 mb-2">{nome}</h2>
      <p className="text-gray-400 text-sm max-w-xs">
        Questa sezione è in fase di sviluppo e sarà disponibile a breve.
      </p>
    </div>
  );
}
