import React from 'react';

export const Pagin = ({ store }) => {


	const onFirst = async () => {
		await store.firstPage();
	}

	const onPrevious = async () => {
		await store.previousPage();
	}

	const onNext = async () => {
		await store.nextPage();
	}

	const onLast = async () => {
		await store.lastPage();
	}

	const onRefresh = async () => {
		await store.reloadPage();
	}

	return (
		<div className="foote-table">
			<div className="navigation">

				<a className="btn-pag" href="#" onClick={onFirst}><i className="fas fa-angle-double-left"></i></a>
				<a className="btn-pag" href="#" onClick={onPrevious}><i className="fas fa-angle-left"></i></a>
				<div className="tool-separator"></div>
				<span className="tool-label">Pagina </span> <span className="tool-label">{store.getPage()} de {store.getTotalPages()}</span>
				<div className="tool-separator"></div>
				<a className="btn-pag" href="#" onClick={onNext}><i className="fas fa-angle-right"></i></a>
				<a className="btn-pag" href="#" onClick={onLast}><i className="fas fa-angle-double-right"></i></a>

			</div>
			<div className="tool-separator"></div>
			<a className="btn-pag" href="#" onClick={onRefresh}><i className="fas fa-sync"></i></a>

		</div>
	);
}
