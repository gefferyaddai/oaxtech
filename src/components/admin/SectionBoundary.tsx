"use client";

import { Component, type ReactNode } from "react";
import { SectionFallback } from "@/components/admin/SectionFallback";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Isolates one dashboard section. A render error inside a widget is contained
 * here and shown as an inline message, so a single failing panel can never
 * blank the whole admin page.
 *
 * Must be a class: React has no hook equivalent of componentDidCatch.
 */
export class SectionBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // Surfaced in the browser console during development; wire to a real
    // error reporter once one is configured.
    console.error("[admin] section failed to render:", error);
  }

  private retry = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <SectionFallback onRetry={this.retry} />;
    }
    return this.props.children;
  }
}
