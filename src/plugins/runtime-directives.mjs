/* Which specimen directives need a running component.
 *
 * Its own module, with no imports, because both sides of the decision need it and they run in
 * different places: remark-monokit.mjs uses it at build time, where it also reads every contract
 * file off disk, and [...slug].astro uses it per page. Importing the plugin from the page pulled
 * those filesystem reads into the prerender bundle, where the paths resolved against dist/.
 *
 * A page carrying none of these never loads React — which is most of Foundations and Styles.
 */
export const RUNTIME_DIRECTIVES = ["example", "anatomy", "states"];
