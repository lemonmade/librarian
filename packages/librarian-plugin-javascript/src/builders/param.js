import {guessTypeFromPath} from './type';
import {ParamType} from '../entities';

export default function paramBuilder(paramPath, state) {
  const {builder} = state;
  const type = paramPath.has('typeAnnotation')
    ? builder.get(paramPath.get('typeAnnotation'), state)
    : null;

  if (paramPath.isObjectPattern()) {
    return {
      type,
      properties: paramPath
        .get('properties')
        .map((paramPropPath) => builder.get(paramPropPath.get('value'), state)),
    };
  } else if (paramPath.isIdentifier()) {
    return {
      type,
      name: paramPath.get('name').node,
    };
  } else if (paramPath.isAssignmentPattern()) {
    return {
      name: paramPath.get('left.name').node,
      type: type || guessTypeFromPath(paramPath.get('right')),
      default: paramPath.get('right.value').node,
    };
  }

  return {};
}

export function mergeParamDetails(pathDetails = [], commentDetails = []) {
  return pathDetails
    .map((pathDetail, index) => createParamObjectFromDetails(
      deeplyMergeParamDetails(pathDetail, commentDetails[index])
    ))
    .concat(
      commentDetails
        .slice(pathDetails.length)
        .map((commentDetail) => createParamObjectFromDetails(commentDetail))
    );
}

function deeplyMergeParamDetails(firstDetails = {}, secondDetails = {}) {
  const {properties: firstProperties = [], elements: firstElements = []} = firstDetails;
  const {properties: secondProperties = [], elements: secondElements = []} = secondDetails;

  const properties = firstProperties
    .map((property, index) => deeplyMergeParamDetails(property, secondProperties[index]))
    .concat(secondProperties.slice(firstProperties.length));

  const elements = firstElements
    .map((element, index) => deeplyMergeParamDetails(element, secondElements[index]))
    .concat(secondElements.slice(firstElements.length));

  return {
    ...firstDetails,
    ...secondDetails,
    type: secondDetails.type || firstDetails.type,
    properties,
    elements,
  };
}

function createParamObjectFromDetails(paramDetails = {}) {
  return ParamType({
    ...paramDetails,
    properties: Array.isArray(paramDetails.properties)
      ? paramDetails.properties.map(createParamObjectFromDetails)
      : paramDetails.properties,
    elements: Array.isArray(paramDetails.elements)
      ? paramDetails.elements.map(createParamObjectFromDetails)
      : paramDetails.elements,
  });
}
