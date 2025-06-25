export interface RouteLink {
  path: string;
  name: string;
  component: React.ComponentType<Record<string, unknown>>; // 任意 props
  description: string;
}
