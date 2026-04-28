MAIN = main
LATEX = pdflatex
FLAGS = -interaction=nonstopmode -halt-on-error

.PHONY: all clean cleanall view

all:
	$(LATEX) $(FLAGS) $(MAIN).tex
	$(LATEX) $(FLAGS) $(MAIN).tex

clean:
	rm -f $(MAIN).aux $(MAIN).log $(MAIN).out $(MAIN).toc

cleanall: clean
	rm -f $(MAIN).pdf

view: all
	open $(MAIN).pdf
