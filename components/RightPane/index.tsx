import IFrame from "./IFrame";

interface Props {
  resize: number;
  showOverlay: boolean;
  twEnabled: boolean;
}

export default function Preview({ resize, showOverlay, twEnabled }: Props) {
  return (
    <section
      className="relative"
      style={{
        width: resize ? `${window.innerWidth - resize}px` : "50%",
        minWidth: 240,
      }}
    >
      {showOverlay && <span className="absolute inset-0"></span>}
      <IFrame twEnabled={twEnabled} />
    </section>
  );
}
