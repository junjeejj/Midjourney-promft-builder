import { useBuilderStore } from "../store/useBuilderStore";

function Row({ label, children }: { label: string; children: React.ReactNode }) {

  return (

    <div>

      <div className="text-xs text-gray-500 mb-1">{label}</div>

      <div className="flex flex-wrap gap-2">{children}</div>

    </div>

  );

}

function Chip({ text }: { text: string }) {

  return (

    <span className="px-2 py-1 text-xs border rounded-full bg-white">{text}</span>

  );

}

export default function SelectedSummary() {

  const { slots, params } = useBuilderStore();

  const camera = Array.isArray(slots.camera) ? slots.camera : [];

  const composition = Array.isArray(slots.composition) ? slots.composition : [];

  const lighting = Array.isArray(slots.lighting) ? slots.lighting : [];

  const color = Array.isArray(slots.color) ? slots.color : [];

  const style = Array.isArray(slots.style) ? slots.style : [];

  return (

    <div className="border rounded-2xl p-3 bg-white space-y-3">

      <div className="font-medium">Selection Summary</div>

      {slots.subject && (

        <Row label="Subject">

          <Chip text={String(slots.subject)} />

        </Row>

      )}

      {!!camera.length && (

        <Row label="Camera">{camera.map((x) => <Chip key={x} text={x} />)}</Row>

      )}

      {!!composition.length && (

        <Row label="Composition">{composition.map((x) => <Chip key={x} text={x} />)}</Row>

      )}

      {!!lighting.length && (

        <Row label="Lighting">{lighting.map((x) => <Chip key={x} text={x} />)}</Row>

      )}

      {!!color.length && (

        <Row label="Color/Tone">{color.map((x) => <Chip key={x} text={x} />)}</Row>

      )}

      {!!style.length && (

        <Row label="Style">{style.map((x) => <Chip key={x} text={x} />)}</Row>

      )}

      <Row label="Parameters">

        {params.ar && <Chip text={`--ar ${params.ar}`} />}

        {typeof params.stylize === "number" && <Chip text={`--stylize ${params.stylize}`} />}

        {typeof params.chaos === "number" && <Chip text={`--chaos ${params.chaos}`} />}

        {typeof params.q === "number" && <Chip text={`--q ${params.q}`} />}

        {typeof params.seed === "number" && <Chip text={`--seed ${params.seed}`} />}

        {params.style && <Chip text={`--style ${params.style}`} />}

        {params.tile && <Chip text="--tile" />}

        {params.niji && <Chip text="--niji" />}

        {params.sref && <Chip text="--sref …" />}

        {params.cref && <Chip text="--cref …" />}

      </Row>

    </div>

  );

}
