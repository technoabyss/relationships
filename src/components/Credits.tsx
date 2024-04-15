import { useEffectOnce, useStateList } from "react-use";
import Link from "next/link";
import { random } from "lodash";
import {
  IconAlien,
  IconAlienFilled,
  IconChartBubble,
  IconChartDots3,
  IconRoute,
  IconShape,
  IconShape2,
  IconShape3,
  IconUnlink
} from "@tabler/icons-react";

const
  VERSION = require("/package.json").version,
  RFG3D_VERSION = require("/package.json").dependencies["react-force-graph-3d"];

const FUN_ICONS = [
  <IconAlienFilled key={0} />,
  <IconShape key={1} />,
  <IconShape2 key={2} />,
  <IconShape3 key={3} />,
  <IconRoute key={4} />,
  <IconUnlink key={5} />,
  <IconChartBubble key={6} />,
  <IconChartDots3 key={7} />,
  <IconUnlink key={8} />,
  <IconUnlink key={9} />,
  <IconAlien key={10} />
];

export default function Credits() {
  const { state: funIcon, next: nextFunIcon, setStateAt: setFunIcon } = useStateList(FUN_ICONS);
  useEffectOnce(() => setFunIcon(random(FUN_ICONS.length - 1)));

  return (
    <div className="
      flex gap-2 justify-center items-center
      select-none
    ">
      <div onClick={nextFunIcon}>
        { funIcon }
      </div>
      <div className="font-mono text-xs leading-none">
        <Link href="https://chitin.link">by chitin.link</Link><br />
        <Link href="https://github.com/chitinlink/relationships">-&gt; relationships {VERSION}</Link><br />
        <Link href="https://github.com/vasturiano/react-force-graph">&lt;3 react-force-graph-3d {RFG3D_VERSION}</Link>
      </div>
    </div>
  );
}
