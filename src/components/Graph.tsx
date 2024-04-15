import dynamic from "next/dynamic";
import { MutableRefObject } from "react";
import { ForceGraphMethods, ForceGraphProps } from "react-force-graph-3d";

interface IWrappedFG3D extends ForceGraphProps {
  forwardedRef: MutableRefObject<ForceGraphMethods>;
}

const Graph = dynamic(
  async () => {
    const { default: FG3D } = await import("react-force-graph-3d");
    const Graph = ({ forwardedRef, ...props }: IWrappedFG3D) => (
      <FG3D ref={forwardedRef} {...props} />
    );
    return Graph;
  },
  { ssr: false }
);

export default Graph;
