import SyntaxHighlighter from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";

const code = `import { ethers } from "ethers";

/**
 * Returns randonmly generated number between from and to by using blockhash as seed.
 * @param blockHash
 * @param from
 * @param to
 */
export async function chooseTokenId(
  blockHash: string,
  from: number,
  to: number
): Promise<number> {
  const hash = ethers.keccak256(
    ethers.toUtf8Bytes(\`\${blockHash}-$\{from}-$\{to}\`)
  );
  const hex = hash.substring(2, 10);
  const seed = parseInt(hex, 16);
  const winner = from + (seed % (to - from + 1));
  return winner;
}
`;

export function Fairness() {
  return (
    <div className="md:max-w-3xl mx-auto flex flex-col items-center justify-center">
      <h2 className="text-5xl font-semibold text-[#7645d9] mb-5">
        How To Verify fairness
      </h2>
      <SyntaxHighlighter
        customStyle={{ borderRadius: "0.2rem", width: "100%", padding: "1rem" }}
        language="typescript"
        style={vs2015}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
