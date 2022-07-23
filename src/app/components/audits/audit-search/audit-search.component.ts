import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-audit-search',
  templateUrl: './audit-search.component.html',
  styleUrls: ['./audit-search.component.scss']
})
export class AuditSearchComponent implements OnInit {

  public form:FormGroup;
  @Output() public auditSearch: any = new EventEmitter<string>();

  constructor(private fb:FormBuilder) { }

  public ngOnInit(): void {
    this.form = this.fb.group({
      searchText: ['']
    })

    this.form.valueChanges.subscribe(value=>{
      this.auditSearch.emit(value)
    })
  }

}
