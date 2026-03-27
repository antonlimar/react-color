import { useState } from 'react';
import type { ComponentType, ElementType } from 'react';

export const handleFocus = <P extends object>(WrappedComponent: ComponentType<P>, Span: ElementType = 'span') =>
  function Focus(props: P) {
    const [focus, setFocus] = useState(false);

    const handleFocus = () => setFocus(true);

    const handleBlur = () => setFocus(false);

    return (
      <Span onFocus={handleFocus} onBlur={handleBlur}>
        <WrappedComponent {...props} {...({ focus } as unknown as Partial<P>)} />
      </Span>
    );
  };
