import IFrame from "./IFrame";

interface Props {
  resize: number;
  showOverlay: boolean;
}

export default function Preview({ resize, showOverlay }: Props) {
  return (
    <section
      className="relative"
      style={{
        width: resize ? `${window.innerWidth - resize}px` : "50%",
        minWidth: 240,
      }}
    >
      {showOverlay && <span className="absolute inset-0"></span>}
      <IFrame />
    </section>
  );
}
