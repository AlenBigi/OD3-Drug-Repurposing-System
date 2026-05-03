import { useEffect, useRef } from "react";
import SmilesDrawer from "smiles-drawer";

export default function MoleculeViewer({ smiles }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!smiles) return;

    const drawer = new SmilesDrawer.Drawer({
      width: 250,
      height: 200
    });

    SmilesDrawer.parse(
  smiles,
  (tree) => {
    drawer.draw(tree, canvasRef.current, "light", false);
  },
  (err) => {
    console.error("SMILES parse error:", err);

    // 🔥 fallback message
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.font = "12px Arial";
      ctx.fillText("Invalid structure", 20, 50);
    }
  }
);;

  }, [smiles]);

  return <canvas ref={canvasRef}></canvas>;
}