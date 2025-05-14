// utils/tagDataTransformer.ts

/**
 * Transform UI form data to API-compatible format
 * @param formValues Form values from the TagWizard component
 * @returns Formatted data ready for API submission
 */
export function transformTagData(formValues: any) {
  // Prepare the tag info object for the API
  const tagInfo = {
    dob: null, // Not collected in the UI
    fname: formValues.basicInfo.firstName,
    lname: formValues.basicInfo.lastName,
    notes: formValues.basicInfo.bio || "", // Use bio as notes or empty string
    title: "Mr", // Hardcoded for now, could be added to form
    avatar: formValues.avatarUrl || null, // Use existing URL if available

    // Extract emails from links
    emails: extractContactItems(formValues.links, 'EMAIL'),

    // Extract phones from links
    phones: extractContactItems(formValues.links, 'PHONE'),

    // Extract company and position
    company: formValues.basicInfo.company || "",
    position: formValues.basicInfo.position || "",

    // Extract websites from links
    websites: extractContactItems(formValues.links, 'WEBSITE'),

    // Extract addresses from links
    addresses: extractContactItems(formValues.links, 'ADDRESS'),

    // Set event type
    eventType: "default-premium"
  };

  // Create the complete data payload
  const dataPayload = {
    userId: parseInt(localStorage.getItem('userId') || '1'),
    companyId: null,
    tagInfo: tagInfo
  };

  return dataPayload;
}

/**
 * Extract contact items of a specific type from the links array
 * @param links Array of link objects
 * @param type Type of contact (EMAIL, PHONE, WEBSITE, ADDRESS)
 * @returns Formatted contact items for the API
 */
function extractContactItems(links: any[], type: string) {
  if (!links || !Array.isArray(links)) return [];

  // Map different link types to their corresponding API type
  const typeMap: Record<string, string[]> = {
    'EMAIL': ['EMAIL'],
    'PHONE': ['PHONE', 'WHATSAPP'],
    'WEBSITE': ['WEBSITE', 'INSTAGRAM', 'FACEBOOK', 'TWITTER', 'LINKEDIN', 'YOUTUBE'],
    'ADDRESS': ['ADDRESS']
  };

  // Get the list of UI link types that map to this API type
  const matchingTypes = typeMap[type] || [type];

  return links
    .filter(link => matchingTypes.includes(link.type) && link.value)
    .map(link => ({
      type: "WORK", // Default to WORK type
      value: link.value
    }));
}
