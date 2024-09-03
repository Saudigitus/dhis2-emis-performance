const postBody = (formData: Record<string, any>, parent: string | undefined) => {
    return {
        data: {
            name: formData["ouName"] ?? formData["ZMmNGOusIGJ"],
            code: formData["ouName"] ?? formData["ZMmNGOusIGJ"],
            shortName: formData["ouName"] ?? formData["ZMmNGOusIGJ"],
            openingDate: formData["registrationDate"],
            parent: { id: parent },
        }
    };
}

export { postBody }