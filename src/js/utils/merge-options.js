/**
 * @file merge-options.js
 * @module merge-options
 */
import merge from 'lodash-compat/object/merge';
import {isPlain} from './obj';

/**
 * Merge customizer. video.js simply overwrites non-simple objects
 * (like arrays) instead of attempting to overlay them.
 *
 * @param {Mixed} destination
 *        The merge destination
 *
 * @param {Mixed} source
 *        A merge source.
 *
 * @retun {Mixed}
 *        The source and destination merged.
 *
 * @see https://lodash.com/docs#merge
 */
function customizer(destination, source) {
  // If we're not working with a plain object, copy the value as is
  // If source is an array, for instance, it will replace destination
  if (!isPlain(source)) {
    return source;
  }

  // If the new value is a plain object but the first object value is not
  // we need to create a new object for the first object to merge with.
  // This makes it consistent with how merge() works by default
  // and also protects from later changes the to first object affecting
  // the second object's values.
  if (!isPlain(destination)) {
    return mergeOptions(source);
  }
}

/**
 * Merge one or more options objects, recursively merging **only**
 * plain object properties.  Previously `deepMerge`.
 *
 * @param  {Object[]} source
 *         One or more objects to merge
 *
 * @returns {Object}
 *          a new object that is the union of all
 */
export default function mergeOptions(...objects) {

  // unshift an empty object into the front of the call as the target
  // of the merge
  objects.unshift({});

  // customize conflict resolution to match our historical merge behavior
  objects.push(customizer);

  merge.apply(null, objects);

  // return the mutated result object
  return objects[0];
}
