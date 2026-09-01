window.__patchPvZRoguePortal = function patchPvZRoguePortal(source) {
  function replaceRequired(from, to, label) {
    if (!source.includes(from)) throw new Error(`Fullscreen loadout patch could not find ${label}.`);
    source = source.replace(from, to);
  }

  replaceRequired(
    'import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";',
    'import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";\nimport { createPortal } from "https://esm.sh/react-dom@18.3.1";',
    'React DOM imports'
  );

  replaceRequired(
    '{state.pregameLoadout && (\n              <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm">',
    '{state.pregameLoadout && createPortal((\n              <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm">',
    'loadout portal opening'
  );

  replaceRequired(
`                  </Button>
                </div>
              </div>
            )}
            <div className="absolute inset-0">`,
`                  </Button>
                </div>
              </div>
            ), document.body)}
            <div className="absolute inset-0">`,
    'loadout portal closing'
  );

  return source;
};
