/* The component set the specimens are handed as `K`.
 *
 * Its own module, importing nothing but the components, so `build/check-specimens.mjs` can load it
 * and check that every `K.member` a specimen reaches for actually exists. mount.jsx cannot serve
 * that purpose: it pulls react-dom/client, which a build check has no business loading.
 *
 * WHY THIS IS A LIST AND WHY THE LIST IS CHECKED
 *
 * The workbench assembled K by regex — `src.match(/export function (\w+)/g)` over each file — so
 * it caught every export without anyone maintaining a list. Rebuilding K from named imports
 * dropped the one export that is not a component: `modalFocusables`, Modal's focusable-node query.
 * Two specimens on the Modal page call it, and the page whose subject is an invisible focus trap
 * lost both of the devices that make the trap visible. It threw only on open, so it survived a
 * page load, a mount count and a clean console.
 *
 * The list is fine. The list being unchecked was not.
 */
import { Pressable } from "../../components/actions/Pressable.jsx";
import { Button } from "../../components/actions/Button.jsx";
import { Icon } from "../../components/display/Icon.jsx";
import { Avatar } from "../../components/display/Avatar.jsx";
import { Field } from "../../components/forms/Field.jsx";
import { Input } from "../../components/forms/Input.jsx";
import { InputOtp } from "../../components/forms/InputOtp.jsx";
import { Switch } from "../../components/forms/Switch.jsx";
import { ListGroup } from "../../components/lists/ListGroup.jsx";
import { ListRow } from "../../components/lists/ListRow.jsx";
import { Screen } from "../../components/navigation/Screen.jsx";
import { ScreenHeader } from "../../components/navigation/ScreenHeader.jsx";
import { Pager } from "../../components/navigation/Pager.jsx";
import { PageDots } from "../../components/navigation/PageDots.jsx";
import { Modal, modalFocusables } from "../../components/overlays/Modal.jsx";
import { Sheet } from "../../components/overlays/Sheet.jsx";

export const K = {
  Pressable, Button, Icon, Avatar,
  Field, Input, InputOtp, Switch,
  ListGroup, ListRow,
  Screen, ScreenHeader, Pager, PageDots,
  Modal, Sheet,
  /* Not a component. Modal's own query for what is focusable inside a layer, which the Modal
     page's tab-order pins and background-reachability probe both read from — they prove the trap
     against the same function the trap uses, rather than against a second opinion. */
  modalFocusables,
};
