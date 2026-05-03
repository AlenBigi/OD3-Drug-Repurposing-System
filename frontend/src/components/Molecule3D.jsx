import { useEffect, useRef, useState } from "react";
import * as $3Dmol from "3dmol";
import MoleculeViewer from "./MoleculeViewer"; // 2D fallback

export default function Molecule3D({ smiles }) {
  const viewerRef = useRef(null);
  const [has3D, setHas3D] = useState(null);
  useEffect(() => {
    if (!viewerRef.current || !smiles) return;

    const viewer = $3Dmol.createViewer(viewerRef.current, {
      backgroundColor: "white"
    });

    viewer.clear();

    fetch(`http://127.0.0.1:8000/mol3d?smiles=${encodeURIComponent(smiles)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.mol) {
          viewer.addModel(data.mol, "mol");
          viewer.setStyle({}, { stick: {}, sphere: { scale: 0.3 } });
          viewer.zoomTo();
          viewer.render();
          setHas3D(true);
        } else {
          setHas3D(false); // 🔥 fallback trigger
        }
      })
      .catch(() => setHas3D(false));

  }, [smiles]);

  // 🔥 Fallback to 2D
  if (!has3D) {
    return <MoleculeViewer smiles={smiles} />;
  }

  return (
    <div
      ref={viewerRef}
      style={{ width: "300px", height: "250px", background: "white" }}
    />
  );
}