export function findAndFocusFirstErrorField(errors = {}) {
    let firstElementRef: any = null;
    let firstElementTop: null|number = null;

    // Mi ciclo gli errori e cerco quello che ha il primo campo di input partendo dall'alto
    Object.values(errors).forEach((error: any) => {
        // console.log(error);
        if (error.ref) {
            const rect = error.ref.getBoundingClientRect();

            if (firstElementTop === null || firstElementTop > rect.top) {
                firstElementTop = rect.top;
                firstElementRef = error.ref;
            }
        }
    });

    if (firstElementRef) {
        firstElementRef.focus();
    }
}
