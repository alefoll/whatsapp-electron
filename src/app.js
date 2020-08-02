const getFavicon = () => {
    const nodeList = [...document.getElementsByTagName("link")];

    let favicon;

    nodeList.map((element) => {
        if ((element.getAttribute("rel") == "icon") || (element.getAttribute("rel") == "shortcut icon"))
            favicon = element.getAttribute("href");
    });

    return favicon;
}