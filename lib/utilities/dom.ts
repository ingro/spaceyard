export function scrollToTableTop() {
    const tableBody = document.getElementsByClassName('--tabulisk-tbody')[0];
            
    if (tableBody) {
        tableBody.scrollTop = 0;
    }
}

export function getScrollbarWidth(): number {
    // thanks too https://davidwalsh.name/detect-scrollbar-width
    const scrollDiv = document.createElement('div');

    scrollDiv.setAttribute(
        'style',
        'width: 100px; height: 100px; overflow: scroll; position:absolute; top:-9999px;'
    );
    document.body.appendChild(scrollDiv);

    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);

    return scrollbarWidth;
}

export const popperSameWidthModifier = {
    name: 'sameWidth',
    enabled: true,
    phase: 'beforeWrite',
    requires: ['computeStyles'],
    fn: ({ state }: any) => {
        state.styles.popper.width = `${state.rects.reference.width}px`;
    },
    effect: ({ state }: any) => {
        state.elements.popper.style.width = `${
            state.elements.reference.offsetWidth
        }px`;
    }
};
