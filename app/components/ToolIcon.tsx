import type { IconType } from 'react-icons'
import {
  SiAmazonwebservices,
  SiApachesuperset,
  SiClickhouse,
  SiDuckdb,
  SiGitea,
  SiNextdotjs,
  SiTemporal,
  SiTerraform,
} from 'react-icons/si'

// A quiet, single-colour brand mark for each tool the site mentions.
// Only the marks that actually appear in a rendered chip are imported, so the
// client bundle stays small. Unknown names render nothing and the chip falls
// back to plain text.
const marks: Record<string, IconType> = {
  clickhouse: SiClickhouse,
  'apache superset': SiApachesuperset,
  superset: SiApachesuperset,
  duckdb: SiDuckdb,
  duckle: SiDuckdb,
  temporal: SiTemporal,
  'next.js': SiNextdotjs,
  nextjs: SiNextdotjs,
  aws: SiAmazonwebservices,
  'aws (s3, iam, kms)': SiAmazonwebservices,
  'aws kms': SiAmazonwebservices,
  'amazon web services': SiAmazonwebservices,
  s3: SiAmazonwebservices,
  iam: SiAmazonwebservices,
  gitea: SiGitea,
  terraform: SiTerraform,
}

export default function ToolIcon({ name, className }: { name: string; className?: string }) {
  const Mark = marks[name.trim().toLowerCase()]
  if (!Mark) return null
  return <Mark aria-hidden className={className} />
}
